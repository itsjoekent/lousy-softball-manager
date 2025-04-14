import { useCallback } from 'react';
import {
  Button,
  Checkbox,
  Group,
  Slider,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import type { EditablePlayerFields } from '../types';
import { positions, positionLabels, skillRange } from '../constants';

type FormFields = EditablePlayerFields & { __hiddenValidationField: string };

type Props = {
  initialValues?: EditablePlayerFields;
  onCancel?: () => void;
  onSubmit: (values: EditablePlayerFields) => void;
  submitLabel: string;
};

const defaultValues: EditablePlayerFields = {
  name: '',
  isMale: false,
  positions: {
    C: 0,
    P: 0,
    '1B': 0,
    '2B': 0,
    SS: 0,
    '3B': 0,
    RF: 0,
    CRF: 0,
    LF: 0,
    CLF: 0,
    CF: 0,
    SCF: 0,
    DH: 0,
  },
};

function getSliderLabel(value: number) {
  switch (value) {
    case 0: return '🛑';
    case 1: return '⚠️';
    case 2: return '👍';
    case 3: return '👌';
    case 4: return '⭐';
    case 5: return '🌟';
  }
}

export function PlayerRosterForm(props: Props) {
  const { initialValues, onCancel, onSubmit, submitLabel } = props;

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      ...(initialValues ?? defaultValues),
      __hiddenValidationField: '',
    },
    validate: {
      __hiddenValidationField: (_value, values) => {
        const { positions } = values;

        if (Object.values(positions).every((value) => value === 0)) {
          return 'At least one position must be turned on';
        }

        return null;
      },
      positions: {
        DH: (value) => {
          if ([0, 3].includes(value)) {
            return null;
          }

          return 'DH must be either forbidden or starter';
        },
      },
    },
  });

  const handleSubmit = useCallback((values: FormFields) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { __hiddenValidationField, ...rest } = values;
    onSubmit(rest);
  }, [onSubmit]);

  return (
    <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
      <Stack gap="sm">
        <TextInput
          required
          label="Name"
          placeholder="Player name"
          key={form.key('name')}
          {...form.getInputProps('name')}
        />
        <Checkbox
          label="Is male"
          key={form.key('isMale')}
          {...form.getInputProps('isMale', { type: 'checkbox' })}
        />
        <Stack>
          {positions.map((positionId) => (
            <Stack gap="xs" key={positionId}>
              <Text>{positionLabels[positionId]}</Text>
              <Slider
                defaultValue={0}
                step={1}
                min={skillRange[0]}
                max={skillRange[1]}
                label={getSliderLabel}
                {...form.getInputProps(`positions.${positionId}`)}
              />
              {form.errors[`positions.${positionId}`] && (
                <Text c="red">{form.errors[`positions.${positionId}`]}</Text>
              )}
            </Stack>
          ))}
        </Stack>
        {form.errors.__hiddenValidationField && (
          <Text c="red">{form.errors.__hiddenValidationField}</Text>
        )}
        <Group justify="flex-end" gap="sm">
          {!!onCancel && (
            <Button color="blue" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">{submitLabel}</Button>
        </Group>
      </Stack>
    </form>
  );
}
