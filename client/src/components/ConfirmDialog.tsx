/**
 * Универсальное подтверждение действия: получает текст, обработчики и состояние запроса.
 * Пока запрос выполняется, блокирует повторное подтверждение и закрытие окна.
 * Не выполняет запросы самостоятельно; ошибки и результат контролирует родитель.
 */
import { useId } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onClose: () => void;
  pending?: boolean;
  disabled?: boolean;
  error?: string;
  confirmText?: string;
  pendingText?: string;
  color?: "primary" | "error";
}

export default function ConfirmDialog({
  open,
  title,
  description,
  onConfirm,
  onClose,
  pending = false,
  disabled = false,
  error,
  confirmText = "Подтвердить",
  pendingText = "Выполнение…",
  color = "primary",
}: ConfirmDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!pending) onClose();
      }}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <DialogTitle id={titleId}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id={descriptionId}>{description}</DialogContentText>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button disabled={pending} onClick={onClose}>
          Отмена
        </Button>
        <Button
          color={color}
          variant="contained"
          disabled={pending || disabled}
          onClick={onConfirm}
        >
          {pending ? pendingText : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
