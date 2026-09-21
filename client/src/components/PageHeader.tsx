/** Заголовок страницы с необязательным действием; переносит элементы на узком экране. */
import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";

export default function PageHeader({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        gap: 2,
        flexWrap: "wrap",
        mb: 3,
      }}
    >
      <Typography variant="h4" component="h1">
        {title}
      </Typography>
      {action}
    </Box>
  );
}
