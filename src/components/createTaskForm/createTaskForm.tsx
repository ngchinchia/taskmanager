import React, {
  FC,
  ReactElement,
  useState,
  useEffect,
  useContext,
} from "react";
import {
  Box,
  Typography,
  Stack,
  LinearProgress,
  Button,
  Alert,
  AlertTitle,
} from "@mui/material";

import { TaskTitleField } from "./_taskTitleField";
import { TaskDescriptionField } from "./_taskDescriptionField";
import { TaskDateField } from "./_taskDateField";
import { TaskSelectField } from "./_taskSelectField";
import { Status } from "./enums/Status";
import { Priority } from "./enums/Priority";

import { useMutation } from "@tanstack/react-query";
import { sendApiRequest } from "../../helpers/sendApiRequest";
import { ICreateTask } from "../taskArea/interfaces/ICreateTask";
import { TaskStatusChangedContext } from "../../context";

/* -Task Title
   -Task Description
   -Task Date 
   -Task Status
   -Task Priority */
export const CreateTaskForm: FC = (): ReactElement => {
  // declare component states
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [date, setDate] = useState<Date | null>(new Date());
  const [status, setStatus] = useState<string>(Status.todo);
  const [priority, setPriority] = useState<string>(Priority.normal);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const taskUpdatedContext = useContext(TaskStatusChangedContext);

  // Create task mutation
  const createTaskMutation = useMutation((data: ICreateTask) =>
    sendApiRequest("https://task-management-backend-zsa6.onrender.com/tasks", "POST", data)
  );

  function createTaskHandler() {
    if (!title || !date || !description) {
      return;
    }

    const task: ICreateTask = {
      title,
      description,
      date: date.toString(),
      status,
      priority,
    };

    createTaskMutation.mutate(task);
  }

  /* Manage Side Effects */
  useEffect(() => {
    if (createTaskMutation.isSuccess) {
      setShowSuccess(true);
      taskUpdatedContext.toggle();
    }

    const successTimeout = setTimeout(() => {
      setShowSuccess(false);
    }, 5000);

    return () => {
      clearTimeout(successTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createTaskMutation.isSuccess]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      width="100%"
      px={4}
      my={6}
    >
      {showSuccess && (
        <Alert severity="success" sx={{ width: "100%", marginBottom: "16px" }}>
          <AlertTitle>Success</AlertTitle>
          Task has been created successfully
        </Alert>
      )}

      <Typography mb={2} component="h2" variant="h6">
        Create A Task
      </Typography>

      <Stack sx={{ width: "100%" }} spacing={2}>
        <TaskTitleField
          disabled={createTaskMutation.isLoading}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TaskDescriptionField
          disabled={createTaskMutation.isLoading}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TaskDateField
          disabled={createTaskMutation.isLoading}
          value={date}
          onChange={(date) => setDate(date)}
        />

        <Stack sx={{ width: "100%" }} direction="row" spacing={2}>
          <TaskSelectField
            disabled={createTaskMutation.isLoading}
            label="Status"
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as string)}
            items={[
              {
                value: Status.todo,
                label: Status.todo.toUpperCase(),
              },
              {
                value: Status.inProgress,
                label: Status.inProgress.toUpperCase(),
              },
            ]}
          />
          <TaskSelectField
            disabled={createTaskMutation.isLoading}
            label="Priority"
            name="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as string)}
            items={[
              {
                value: Priority.low,
                label: Priority.low,
              },
              {
                value: Priority.normal,
                label: Priority.normal,
              },
              {
                value: Priority.high,
                label: Priority.high,
              },
            ]}
          />
        </Stack>
        {createTaskMutation.isLoading && <LinearProgress />}
        <Button
          disabled={!title || !description || !date || !status || !priority}
          onClick={createTaskHandler}
          variant="contained"
          size="large"
          fullWidth
        >
          Create A Task
        </Button>
      </Stack>
    </Box>
  );
};
