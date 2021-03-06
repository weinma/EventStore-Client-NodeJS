import { createTestNode } from "../utils";

import {
  readEventsFromStream,
  writeEventsToStream,
  EventStoreConnection,
  EventData,
} from "../..";

describe("singleNodeConnection", () => {
  const node = createTestNode();
  const STREAM_NAME = "test_stream_name";
  const event = EventData.json("test", { message: "test" });

  beforeAll(async () => {
    await node.up();
  });

  afterAll(async () => {
    await node.down();
  });

  test("should successfully connect", async () => {
    const connection = EventStoreConnection.builder()
      .sslRootCertificate(node.certPath)
      .singleNodeConnection(node.uri);

    const writeResult = await writeEventsToStream(STREAM_NAME)
      .send(event.build())
      .execute(connection);

    expect(writeResult).toBeDefined();

    const readResult = await readEventsFromStream(STREAM_NAME).execute(
      connection
    );

    expect(readResult).toBeDefined();
  });
});
