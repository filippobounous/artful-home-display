import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AddItemForm } from '../AddItemForm';
import * as api from '@/lib/api';

describe('AddItemForm', () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });


  it('loads draft when editing', () => {
    const draft = {
      title: 'Draft Item',
      artist: 'Artist',
      category: 'art',
      subcategory: '',
      size: '',
      valuation: '',
      valuationDate: undefined,
      valuationPerson: '',
      valuationCurrency: 'EUR',
      quantity: '1',
      yearPeriod: '2020',
      house: '',
      room: '',
      description: '',
      condition: 'mint',
      notes: '',
      images: [],
    };
    localStorage.setItem('editingDraft', JSON.stringify(draft));

    render(
      <MemoryRouter initialEntries={[ '/?draftId=1' ]}>
        <AddItemForm />
      </MemoryRouter>
    );

    expect(screen.getByDisplayValue('Draft Item')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument();
  });
});
