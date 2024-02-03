import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import Task from "../src/task.js";
import { setTimeout } from "node:timers/promises";

describe("Task Test Suite", () => {
  let _logMock;
  let _task;
  beforeEach(() => {
    _logMock = jest.spyOn(console, console.log.name).mockImplementation();

    _task = new Task();
  });

  it("should only run tasks that are due with fake timers (fast)", async () => {
    jest.useFakeTimers();

    const logSpy = jest.spyOn(console, 'log');

    const tasks = [
      {
        name: "Task-Will-Run-In-5-Ses",
        dueAt: new Date(Date.now() + 5000),
        fn: jest.fn(),
      },
      {
        name: "Task-Will-Run-In-10-Ses",
        dueAt: new Date(Date.now() + 10000),
        fn: jest.fn(),
      },
    ];

    _task.save(tasks.at(0));
    _task.save(tasks.at(1));

    _task.run(200);

    jest.advanceTimersByTime(4000);

    expect(tasks.at(0).fn).not.toHaveBeenCalled();
    expect(tasks.at(1).fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(2000);

    expect(tasks.at(0).fn).toHaveBeenCalled();
    expect(tasks.at(1).fn).not.toHaveBeenCalled();

    expect(logSpy).toHaveBeenNthCalledWith(1, `task [${tasks[0].name}] saved and will be executed at ${tasks[0].dueAt.toISOString()}`);
    
    jest.advanceTimersByTime(4000);
    
    expect(tasks.at(0).fn).toHaveBeenCalled();
    expect(tasks.at(1).fn).toHaveBeenCalled();
    
    expect(logSpy).toHaveBeenNthCalledWith(2, `task [${tasks[1].name}] saved and will be executed at ${tasks[1].dueAt.toISOString()}`);
    
    jest.advanceTimersByTime(1000);

    expect(logSpy).toHaveBeenNthCalledWith(3,'tasks finished!');

    jest.useRealTimers();
  });
});
