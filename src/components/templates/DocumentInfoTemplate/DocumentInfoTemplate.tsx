import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import type { DocumentInfoTemplateType } from "./DocumentInfoTemplate.type";

const DocumentInfoTemplate = ({
  children,
  ...props
}: DocumentInfoTemplateType) => {
  return (
    <Container>
      <Box sx={{ mt: 12 }}>
        <Typography variant="h5" gutterBottom>
          {props.documentTitel}
        </Typography>
        <div>{children}</div>
        {props.isButtonsShown && (
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 1 }}
              onClick={props.onClickButton}
            >
              {props.buttonLabel}
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default DocumentInfoTemplate;
