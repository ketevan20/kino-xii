export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: Record<string, string[]>, 
    public body?: unknown                      
  ) {
    super(message);
  }

  get isFieldError() {
    return this.status === 422 && !!this.errors;   
  }
  get isRuleError() {
    return this.status === 422 && !this.errors;    
  }
}