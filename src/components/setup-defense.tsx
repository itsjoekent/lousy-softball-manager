import { useEffect } from 'react';
import { Loader, Stack, Text, Title } from '@mantine/core';
import { useDefenseGenerator } from '../utils/use-defense-generator';

type Props = {
  onSubmit: () => void;
};

export function SetupDefense(props: Props) {
  const { onSubmit } = props;

  const { generate } = useDefenseGenerator();

  useEffect(() => {
    generate(0, onSubmit);
  }, [generate, onSubmit]);

  return (
    <Stack>
      <Title order={2}>Setup Defense</Title>
      <Text>Simulating optimal defensive configuration</Text>
      <Loader />
    </Stack>
  );
}
