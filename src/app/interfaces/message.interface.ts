export interface Message {
  content: string;
  sender: string;
  recipient: string;
  timestamp: string;
  images?: { url: string; type: string }[];
  videos?: { url: string; type: string }[];
 documents?: { url: string; type: string; name: string }[];
}
