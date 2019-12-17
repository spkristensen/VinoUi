export class AlertInfo {
    constructor(type: string, message: string) {
      this.message = message;
      this.type = type;
    }

    
    type: string;
    message: string;
  }
