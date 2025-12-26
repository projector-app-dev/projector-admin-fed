import { Box, Button, LinearProgress, Typography } from "@mui/material";
import type { ChangeEvent } from "react";

interface MultipleFileInputProps {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  files: File[];
  progress: { [key: string]: number };
}

const MultipleFileInput = ({
  onChange,
  files,
  progress,
}: MultipleFileInputProps) => {
  return (
    <>
      <Box mt={2}>
        {files.map((file) => (
          <Box key={file.name} mb={1}>
            <Typography variant="body2">{file.name}</Typography>
            <LinearProgress
              variant="determinate"
              value={progress[file.name] || 0}
            />
          </Box>
        ))}
      </Box>
      <Button
        variant="contained"
        component="label" // This makes the Button act as a label for the input
      >
        Завантаження файлів
        <input
          type="file"
          hidden
          multiple // Key attribute for multiple file selection
          onChange={onChange}
        />
      </Button>
    </>
  );
};

export default MultipleFileInput;
