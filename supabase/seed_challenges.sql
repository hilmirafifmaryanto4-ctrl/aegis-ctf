-- Insert Dummy Challenges
insert into public.challenges (title, category, description, points, flag, is_active)
values 
('Sanity Check', 'Misc', 'Welcome to Aegis CTF! The flag is right here: `AEGIS{welcome_to_the_game}`', 10, 'AEGIS{welcome_to_the_game}', true),

('Base64 Basic', 'Crypto', 'Can you decode this? `QUVHSVN7YmFzZTY0X2lzX25vdF9lbmNyeXB0aW9ufQ==`', 50, 'AEGIS{base64_is_not_encryption}', true),

('Inspect Element', 'Web', 'The flag is hidden in the HTML source code of this page (not really, but imagine it is). Flag: `AEGIS{html_hero}`', 50, 'AEGIS{html_hero}', true),

('Buffer Overflow 101', 'Pwn', 'Just a classic buffer overflow. Flag is `AEGIS{stack_smashing_detected}`', 100, 'AEGIS{stack_smashing_detected}', true),

('Reverse Me', 'Reverse', 'If you reverse this string "gnirts_desrever", what do you get? Flag: `AEGIS{reversed_string}`', 100, 'AEGIS{reversed_string}', true);
