let counter = 0;

export function v4(): string {
  counter++;
  return `mock-uuid-${counter}-${Date.now()}`;
}

const uuidMock = { v4 };
export default uuidMock;
