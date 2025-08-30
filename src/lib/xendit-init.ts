import { Xendit, Invoice as InvoiceClient } from "xendit-node";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const xenditClient = new Xendit({
  secretKey: process.env.XENDIT_SECRET_API_KEY || "",
});
// const { Invoice } = xenditClient;

const xenditInvoiceClient = new InvoiceClient({
  secretKey: process.env.XENDIT_SECRET_API_KEY || "",
});

export default xenditInvoiceClient;
