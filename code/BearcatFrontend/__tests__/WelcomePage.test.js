import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import WelcomePage from '../app/(auth)/welcome'; // adjust path if needed
import { useRouter } from 'expo-router';

// Mock navigation
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

describe('WelcomePage', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({ push: pushMock });
  });

  it('renders welcome message and buttons', () => {
    const { getByText } = render(<WelcomePage />);

    expect(getByText('Always take control')).toBeTruthy();
    expect(getByText('of your finances')).toBeTruthy();
    expect(getByText('Get Started')).toBeTruthy();
    expect(getByText('Sign in')).toBeTruthy();
  });

  it('navigates to login screen on sign in press', () => {
    const { getByText } = render(<WelcomePage />);
    fireEvent.press(getByText('Sign in'));
    expect(pushMock).toHaveBeenCalledWith('/(auth)/login');
  });

  it('navigates to register screen on get started press', () => {
    const { getByText } = render(<WelcomePage />);
    fireEvent.press(getByText('Get Started'));
    expect(pushMock).toHaveBeenCalledWith('/(auth)/register');
  });
});
