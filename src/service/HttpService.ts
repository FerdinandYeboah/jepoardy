import axios, { AxiosError } from "axios";
import { TopicBackendModel } from "../models/Topic";
import { ServerError } from "../models/ServerError";

class HttpService {
    //Axios client
    httpClient = axios.create({
        baseURL: 'http://localhost:3001',
        responseType: 'json',
        headers: {
          'Content-Type': 'application/json'
        }
      });

    //Operations
    async getTopicsList(): Promise<TopicBackendModel[]> {
        try {
            const response = await this.httpClient.get<TopicBackendModel[]>('/topics');
            const topics = response.data;
            return topics;

            //Suppose could have global exception handling? Right now only returning body, not http code
          } 
          catch (err) {
            if (err && err.response) {
              const axiosError = err as AxiosError<ServerError>
              //return axiosError.response.data;
            }
            
            throw err;
          }
    }

}

let httpService = new HttpService();

export { httpService }