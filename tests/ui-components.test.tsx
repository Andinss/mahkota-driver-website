import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StarRating from '@/components/ui/StarRating';
import Avatar from '@/components/ui/Avatar';
import PlayStoreButton from '@/components/ui/PlayStoreButton';

describe('StarRating', () => {
  it('renders 5 stars total', () => {
    const { container } = render(<StarRating rating={3} />);
    const stars = container.querySelectorAll('svg');
    expect(stars).toHaveLength(5);
  });

  it('for rating=3: 3 filled stars (text-gold) and 2 empty stars (text-gray-600)', () => {
    const { container } = render(<StarRating rating={3} />);
    const stars = container.querySelectorAll('svg');
    const filled = Array.from(stars).filter((s) => s.classList.contains('text-gold'));
    const empty = Array.from(stars).filter((s) => s.classList.contains('text-gray-600'));
    expect(filled).toHaveLength(3);
    expect(empty).toHaveLength(2);
  });

  it('for rating=5: all 5 filled', () => {
    const { container } = render(<StarRating rating={5} />);
    const stars = container.querySelectorAll('svg');
    const filled = Array.from(stars).filter((s) => s.classList.contains('text-gold'));
    expect(filled).toHaveLength(5);
  });

  it('for rating=1: 1 filled, 4 empty', () => {
    const { container } = render(<StarRating rating={1} />);
    const stars = container.querySelectorAll('svg');
    const filled = Array.from(stars).filter((s) => s.classList.contains('text-gold'));
    const empty = Array.from(stars).filter((s) => s.classList.contains('text-gray-600'));
    expect(filled).toHaveLength(1);
    expect(empty).toHaveLength(4);
  });

  it('has aria-label with rating info', () => {
    render(<StarRating rating={4} />);
    const ratingElement = screen.getByRole('img');
    expect(ratingElement).toHaveAttribute('aria-label', 'Rating 4 dari 5');
  });
});

describe('Avatar', () => {
  it('shows initials when photoUrl is null', () => {
    render(<Avatar name="John Doe" photoUrl={null} />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('shows correct initials (first letters of name words, max 2)', () => {
    render(<Avatar name="Ahmad Budi Cahyono" photoUrl={null} />);
    expect(screen.getByText('AB')).toBeInTheDocument();
  });

  it('has correct size styling', () => {
    const { container } = render(<Avatar name="Test User" photoUrl={null} size={64} />);
    const avatar = container.firstElementChild as HTMLElement;
    expect(avatar.style.width).toBe('64px');
    expect(avatar.style.height).toBe('64px');
  });

  it('has aria-label with name', () => {
    render(<Avatar name="Budi Santoso" photoUrl={null} />);
    expect(screen.getByLabelText('Avatar Budi Santoso')).toBeInTheDocument();
  });
});

describe('PlayStoreButton', () => {
  const testUrl = 'https://play.google.com/store/apps/details?id=com.mahkotadrive';

  it('renders an anchor tag', () => {
    render(<PlayStoreButton url={testUrl} />);
    const link = screen.getByRole('link');
    expect(link.tagName).toBe('A');
  });

  it('has correct href (url prop)', () => {
    render(<PlayStoreButton url={testUrl} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', testUrl);
  });

  it('has target="_blank"', () => {
    render(<PlayStoreButton url={testUrl} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('has rel="noopener noreferrer"', () => {
    render(<PlayStoreButton url={testUrl} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('has aria-label', () => {
    render(<PlayStoreButton url={testUrl} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('aria-label');
  });

  it('has minimum touch target size (min-h-[44px] min-w-[44px])', () => {
    render(<PlayStoreButton url={testUrl} />);
    const link = screen.getByRole('link');
    expect(link.className).toContain('min-h-[44px]');
    expect(link.className).toContain('min-w-[44px]');
  });
});
