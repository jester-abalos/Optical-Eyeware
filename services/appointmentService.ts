import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from '../src/config/supabase';

// Get Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || supabaseConfig.url;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || supabaseConfig.anonKey;

export const supabaseAppointments = createClient(supabaseUrl, supabaseAnonKey);

export interface Appointment {
  id: string;
  name: string;
  phone: string;
  email?: string;
  time: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  doctor?: string;
  department?: string;
  priority?: string;
  appointment_type?: string;
  request_source?: string;
}

// Create a new appointment
export const createAppointment = async (appointmentData: {
  name: string;
  phone: string;
  date: string;
}): Promise<Appointment> => {
  try {
    console.log('📅 Creating appointment:', appointmentData);
    
    // Convert date string to timestamp for database
    const appointmentDateTime = new Date(appointmentData.date).toISOString();
    
    const { data, error } = await supabaseAppointments
      .from('appointments')
      .insert({
        name: appointmentData.name,
        phone: appointmentData.phone,
        time: appointmentDateTime, // Use 'time' field as per your schema
        status: 'Pending', // Default status from schema
        request_source: 'Website' // Track appointment source
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating appointment:', error);
      throw error;
    }

    console.log('✅ Appointment created successfully:', data);
    return data;
  } catch (error) {
    console.error('❌ Failed to create appointment:', error);
    throw error;
  }
};

// Get all appointments
export const getAppointments = async (): Promise<Appointment[]> => {
  try {
    console.log('📅 Fetching all appointments...');
    
    const { data, error } = await supabaseAppointments
      .from('appointments')
      .select('*')
      .order('time', { ascending: true });

    if (error) {
      console.error('❌ Error fetching appointments:', error);
      throw error;
    }

    console.log('✅ Appointments fetched:', data.length, 'items');
    return data || [];
  } catch (error) {
    console.error('❌ Failed to fetch appointments:', error);
    throw error;
  }
};

// Get appointments by date
export const getAppointmentsByDate = async (date: string): Promise<Appointment[]> => {
  try {
    console.log('📅 Fetching appointments for date:', date);
    
    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const { data, error } = await supabaseAppointments
      .from('appointments')
      .select('*')
      .gte('time', startOfDay.toISOString())
      .lte('time', endOfDay.toISOString())
      .order('time', { ascending: true });

    if (error) {
      console.error('❌ Error fetching appointments by date:', error);
      throw error;
    }

    console.log('✅ Appointments fetched for date:', data.length, 'items');
    return data || [];
  } catch (error) {
    console.error('❌ Failed to fetch appointments by date:', error);
    throw error;
  }
};

// Update appointment status
export const updateAppointmentStatus = async (id: string, status: string): Promise<Appointment> => {
  try {
    console.log('📅 Updating appointment status:', { id, status });
    
    const { data, error } = await supabaseAppointments
      .from('appointments')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating appointment status:', error);
      throw error;
    }

    console.log('✅ Appointment status updated:', data);
    return data;
  } catch (error) {
    console.error('❌ Failed to update appointment status:', error);
    throw error;
  }
};

// Delete appointment
export const deleteAppointment = async (id: string): Promise<void> => {
  try {
    console.log('📅 Deleting appointment:', id);
    
    const { error } = await supabaseAppointments
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Error deleting appointment:', error);
      throw error;
    }

    console.log('✅ Appointment deleted successfully');
  } catch (error) {
    console.error('❌ Failed to delete appointment:', error);
    throw error;
  }
};

// Subscribe to real-time appointment changes
export const subscribeToAppointmentChanges = (
  callback: (appointment: Appointment) => void
) => {
  console.log('🔄 Setting up real-time appointment subscription...');
  
  try {
    const channel = supabaseAppointments
      .channel('appointment-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments'
        },
        (payload) => {
          console.log('📅 Appointment change detected:', payload);
          
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            callback(payload.new as Appointment);
          } else if (payload.eventType === 'DELETE') {
            // For delete events, you might want to handle differently
            console.log('🗑️ Appointment deleted:', payload.old);
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Appointment subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Real-time appointment subscription active!');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Real-time appointment subscription error - Channel error occurred');
        } else if (status === 'TIMED_OUT') {
          console.error('⏰ Real-time appointment subscription error - Connection timed out');
        } else if (status === 'CLOSED') {
          console.log('🔌 Real-time appointment subscription closed');
        }
      });

    return channel;
  } catch (error) {
    console.error('❌ Failed to set up real-time appointment subscription:', error);
    return {
      unsubscribe: () => console.log('🔇 Unsubscribing from appointment changes')
    } as any;
  }
};

// Unsubscribe from appointment changes
export const unsubscribeFromAppointmentChanges = (channel: any) => {
  try {
    if (channel && typeof channel.unsubscribe === 'function') {
      supabaseAppointments.removeChannel(channel);
      console.log('🔇 Unsubscribed from appointment changes');
    } else {
      console.log('🔇 No active appointment subscription to unsubscribe');
    }
  } catch (error) {
    console.error('❌ Error unsubscribing from appointment changes:', error);
  }
};
