export const QUEUE_NAMES = Object.freeze({
  TEST_QUEUE: "test_queue_1",
});

export function getQueueName(key: string): string {
  if (!QUEUE_NAMES.hasOwnProperty(key)) {
    throw new Error(`Queue name for key "${key}" does not exist.`);
  }
  return QUEUE_NAMES[key as keyof typeof QUEUE_NAMES];
}
