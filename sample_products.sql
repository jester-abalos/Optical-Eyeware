-- Sample Products for Testing Category Filtering
-- Run this in your Supabase SQL Editor to add test products

INSERT INTO inventory (name, category, stock, price, supplier, description, frame_type, lens_type, color, size, image) VALUES
('Classic Aviator Frame', 'Frame', 15, 3500.00, 'Ray-Ban', 'Timeless aviator style with classic gold frame', 'Full Rim', 'Single Vision', 'Gold', 'Medium', 'https://images.unsplash.com/photo-15114994778065-49ccfb545e7d?w=400'),
('Modern Titanium Frame', 'Frame', 8, 4200.00, 'Oakley', 'Lightweight titanium frame with modern design', 'Semi-Rimless', 'Progressive', 'Silver', 'Large', 'https://images.unsplash.com/photo-1511499478065-49ccfb545e7d?w=400'),
('Designer Cat Eye Frame', 'Frame', 12, 2800.00, 'Gucci', 'Elegant cat eye style with acetate frame', 'Full Rim', 'Bifocal', 'Black', 'Small', 'https://images.unsplash.com/photo-1511499478065-49ccfb545e7d?w=400'),
('Sport Wrap Frame', 'Frame', 20, 1800.00, 'Nike', 'Sport wraparound frame for active lifestyle', 'Wrap', 'Single Vision', 'Blue', 'Medium', 'https://images.unsplash.com/photo-1511499478065-49ccfb545e7d?w=400'),
('Vintage Round Frame', 'Frame', 6, 2200.00, 'Warby Parker', 'Vintage-inspired round frame', 'Round', 'Single Vision', 'Tortoise', 'Medium', 'https://images.unsplash.com/photo-1511499478065-49ccfb545e7d?w=400'),

('Classic Wayfarer', 'Sunglasses', 25, 1500.00, 'Ray-Ban', 'Iconic wayfarer style', 'Full Rim', 'Non-Polarized', 'Black', 'Medium', 'https://images.unsplash.com/photo-1511499478065-49ccfb545e7d?w=400'),
('Sport Sunglasses', 'Sunglasses', 18, 1200.00, 'Oakley', 'High-performance sport sunglasses', 'Wrap', 'Polarized', 'Red', 'Large', 'https://images.unsplash.com/photo-1511499478065-49ccfb545e7d?w=400'),

('Daily Contact Lenses', 'Contact Lenses', 100, 800.00, 'Acuvue', 'Daily disposable contact lenses', 'Soft', 'Daily', 'Blue', 'Standard', 'https://images.unsplash.com/photo-1511499478065-49ccfb545e7d?w=400'),
('Monthly Contact Lenses', 'Contact Lenses', 50, 1200.00, 'Bausch & Lomb', 'Monthly replacement contact lenses', 'Soft', 'Monthly', 'Green', 'Standard', 'https://images.unsplash.com/photo-1511499478065-49ccfb545e7d?w=400');
