export function mapToTransactionLog(data: any): any {
  console.log("🚀 ~ mapToTransactionLog ~ data:", data);
  return {
    ModifiedDateTime: new Date().toISOString(),
    Name: "territory",
    ErrorMessage: data?.errorMessage[0] || "",
    Success: data.success ? "true" : "false",
    Direction: "Outbound",
    LogType: "territory",
    Owner: "",
    ProcessCompletionTime: new Date().toISOString(),
  };
}
