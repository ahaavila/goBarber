// Adiciono na biblioteca do Express, na interface do Request um user que contem um id do tipo string
declare namespace Express {
  export interface Request {
    user: {
      id: string;
    };
  }
}
