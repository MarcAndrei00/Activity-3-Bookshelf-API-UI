import { render, screen } from '@testing-library/react';
import App from './App';

test('renders bookshelf header', () => {
  render(<App />);
  const header = screen.getByText(/my bookshelf/i);
  expect(header).toBeInTheDocument();
});
