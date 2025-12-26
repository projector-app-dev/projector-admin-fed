import { Box, Button, LinearProgress, Typography } from "@mui/material";

const MultipleFileInput = ({ onChange, files, progress }) => {
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
