import { LoginPage } from '@pages/login';
import React from 'react';

export type NotAuthenticatedLayoutProps = {
  onSuccess: () => void;
};

export const NotAuthenticatedLayout: React.FC<NotAuthenticatedLayoutProps> = ({ onSuccess }) => (
  <LoginPage onSuccess={onSuccess} />
);

export default NotAuthenticatedLayout;
