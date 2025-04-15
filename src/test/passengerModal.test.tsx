// import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PassengerModal from '../components/PassengerModal';
import '@testing-library/jest-dom';

jest.mock('../services/passengerTypesServices', () => ({
  getPassengerTypes: jest.fn().mockResolvedValue([
    {
      id: 1,
      name: 'Adulto',
      ageMin: 18,
      ageMax: 64,
      passenger: []
    },
    {
      id: 2,
      name: 'Niño',
      ageMin: 2,
      ageMax: 17,
      passenger: []
    }
  ])
}));

describe('PassengerModal', () => {
  const mockProps = {
    open: true,
    onClose: jest.fn(),
    onTotalChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('debe renderizar correctamente con los tipos de pasajero', async () => {
    await act(async () => {
      render(<PassengerModal {...mockProps} />);
    });

    expect(screen.getByText('ADULTO')).toBeInTheDocument();
    expect(screen.getByText('NIÑO')).toBeInTheDocument();
    expect(screen.getByText('Continuar')).toBeInTheDocument();
  });

    it('debe manejar correctamente la discapacidad de pasajeros', async () => {
    await act(async () => {
      render(<PassengerModal {...mockProps} />);
    });

    const addButtons = screen.getAllByText('+');
    await act(async () => {
      await userEvent.click(addButtons[0]); 
    });

   const switches = screen.getAllByRole('checkbox');
    await act(async () => {
      await userEvent.click(switches[0]);
    });

    expect(switches[0]).toBeChecked();
  });

  it('debe llamar a onTotalChange con los datos correctos al continuar', async () => {
    await act(async () => {
      render(<PassengerModal {...mockProps} />);
    });

    const addButtons = screen.getAllByText('+');
    await act(async () => {
      await userEvent.click(addButtons[0]); 
      await userEvent.click(addButtons[1]); 
    });

    const switches = screen.getAllByRole('checkbox');
    await act(async () => {
      await userEvent.click(switches[0]);
    });

    await act(async () => {
      await userEvent.click(screen.getByText('Continuar'));
    });

    expect(mockProps.onTotalChange).toHaveBeenCalledWith({
      total: 2,
      byType: {
        adult: 1,
        child: 1
      },
      disabilityInfo: {
        totalDisabled: 1,
        byType: {
          adult: 1,
          child: 0
        }
      }
    });
  });
});