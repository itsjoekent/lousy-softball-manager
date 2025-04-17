import { Button, Stack, Title } from '@mantine/core';
import { DefenseEditor } from './defense-editor';

type Props = {
  onSubmit: () => void;
};

export function SetupDefense(props: Props) {
  const { onSubmit } = props;

  return (
    <Stack>
      <Title order={2}>Setup Defense</Title>
      <DefenseEditor />
      <Button onClick={onSubmit}>
        Next
      </Button>
    </Stack>
  );
}
