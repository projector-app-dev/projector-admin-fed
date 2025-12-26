import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import type { DocumentTemplateType } from "./DocumentTemplate.type";
import Typography from "@mui/material/Typography";

const DocumentTemplate = ({ children, ...props }: DocumentTemplateType) => {
  return (
    <Container>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{ mt: 12 }}
        onSubmit={props.onSubmit}
      >
        <Typography variant="h5" gutterBottom>
          {props.title}
        </Typography>
        <div>{children}</div>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="submit" variant="contained" sx={{ mt: 1 }}>
            Зберегти
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default DocumentTemplate;
