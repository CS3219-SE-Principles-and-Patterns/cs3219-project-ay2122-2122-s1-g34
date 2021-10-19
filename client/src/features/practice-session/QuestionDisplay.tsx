import { Box, BoxProps, Typography } from "@mui/material";

import { Question } from "features/practice-session/question.interface";

interface QuestionDisplayProps extends BoxProps {
  question: Question;
}

export default function QuestionDisplay({
  question,
  sx,
  ...rest
}: QuestionDisplayProps) {
  return (
    <Box
      {...rest}
      sx={{
        ...(sx ?? {}),
        borderRadius: 3,
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: "orange.main",
        padding: 2,
      }}
    >
      <Typography variant="h6" fontWeight="600">Question: {question.title}</Typography>
      <Typography dangerouslySetInnerHTML={{ __html: question.questionHtml }} />
    </Box>
  );
}
