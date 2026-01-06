import { useState, useEffect, useRef } from 'react';
import { 
  createAppointment, 
  getAppointments, 
  updateAppointmentStatus,
  deleteAppointment,
  subscribeToAppointmentChanges,
  unsubscribeFromAppointmentChanges,
  Appointment
} from '../services/appointmentService';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<any>(null);

  // Load appointments on mount
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getAppointments();
        setAppointments(data);
      } catch (err) {
        setError('Failed to load appointments');
        console.error('❌ Error loading appointments:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAppointments();
  }, []);

  // Set up real-time subscription
  useEffect(() => {
    const setupRealTimeSubscription = () => {
      console.log('🔄 Setting up appointment subscription...');
      const channel = subscribeToAppointmentChanges((newAppointment) => {
        console.log('💬 New appointment change received:', newAppointment);
        setAppointments(prev => {
          // Check if appointment already exists
          const existingIndex = prev.findIndex(apt => apt.id === newAppointment.id);
          
          if (existingIndex >= 0) {
            // Update existing appointment
            const updated = [...prev];
            updated[existingIndex] = newAppointment;
            return updated;
          } else {
            // Add new appointment
            return [...prev, newAppointment];
          }
        });
      });
      
      channelRef.current = channel;
    };

    setupRealTimeSubscription();

    // Cleanup subscription on unmount
    return () => {
      if (channelRef.current) {
        unsubscribeFromAppointmentChanges(channelRef.current);
      }
    };
  }, []);

  // Create new appointment
  const createNewAppointment = async (appointmentData: {
    name: string;
    email: string;
    phone: string;
    service: string;
    date: string;
    notes: string;
  }): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Add appointment locally for instant feedback
      const tempAppointment: Appointment = {
        id: `temp_${Date.now()}`,
        name: appointmentData.name,
        phone: appointmentData.phone,
        time: new Date(appointmentData.date).toISOString(), // Convert date to timestamp
        status: 'Scheduled',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setAppointments(prev => [...prev, tempAppointment]);
      console.log('✅ Appointment added locally:', appointmentData.name);
      
      // Create appointment in database
      const createdAppointment = await createAppointment(appointmentData);
      
      // Replace temp appointment with real one
      setAppointments(prev => 
        prev.map(apt => apt.id === tempAppointment.id ? createdAppointment : apt)
      );
      
      console.log('✅ Appointment created in database:', createdAppointment.id);
    } catch (err) {
      setError('Failed to create appointment');
      console.error('❌ Error creating appointment:', err);
      
      // Remove temp appointment if creation failed
      setAppointments(prev => prev.filter(apt => apt.id !== `temp_${Date.now()}`));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update appointment status
  const updateStatus = async (id: string, status: string): Promise<void> => {
    try {
      setError(null);
      await updateAppointmentStatus(id, status);
      // Real-time subscription will handle the update
    } catch (err) {
      setError('Failed to update appointment status');
      console.error('❌ Error updating appointment status:', err);
      throw err;
    }
  };

  // Delete appointment
  const removeAppointment = async (id: string): Promise<void> => {
    try {
      setError(null);
      await deleteAppointment(id);
      // Real-time subscription will handle the deletion
    } catch (err) {
      setError('Failed to delete appointment');
      console.error('❌ Error deleting appointment:', err);
      throw err;
    }
  };

  // Refresh appointments
  const refreshAppointments = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAppointments();
      setAppointments(data);
    } catch (err) {
      setError('Failed to refresh appointments');
      console.error('❌ Error refreshing appointments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    appointments,
    isLoading,
    error,
    createNewAppointment,
    updateStatus,
    removeAppointment,
    refreshAppointments,
  };
};
