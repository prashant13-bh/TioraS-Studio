export const ADMIN_EMAILS = ['ph293815@gmail.com', 'tyoras9686@gmail.com', 'dsmullam@gmail.com', ...(process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map(email => email.trim()).filter(Boolean)];

export const isAdminEmail = (email: string | null | undefined) => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email);
};
