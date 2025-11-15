import { supabase } from '@/lib/supabase';
import EventSource from "react-native-sse";
import { create } from 'zustand';
type Entity = Record<string, any>;



type State = {
  friendsInfo: Entity,
  personInfo: Entity,
  messageList: Array<Entity>,
  currentMessage: string,
  conversationId: string | null,
  fetchFriendsInfo: (person_id:number) => Promise<void>,
  fetchMessageList: () => Promise<void>,
  sendMessage: (content: string) => Promise<any>,
};

export const useChatStore  = create<State>((set, get) => ({
  friendsInfo: {},
  personInfo: {},
  messageList: [],
  conversationId: null,
  currentMessage: '',
  fetchFriendsInfo: async (person_id: number) => {
    const { data, error } = await supabase.functions.invoke('chat/getFriend', {
      body: { person_id },
    })
    if (error) {
      console.error(error);
    } else {
      console.log(data,error)
      set({ friendsInfo: data.data.friend });
      set({ personInfo: data.data.person });
    }
  },
  fetchMessageList: async () => {
    const { data, error } = await supabase.from('messages').select('*');
    if (error) {
      console.error(error);
    } else {
      set({ messageList : data });
    }
  },
  sendMessage: async (content: string) => {
    const trimmedContent = content.trim();

    if (!trimmedContent) {
      throw new Error('Message content cannot be empty.');
    }

    const difyApiKey = 'app-7VMiJHiBHBWZrnwe10uR6DMb';
    if (!difyApiKey) {
      throw new Error('Missing EXPO_PUBLIC_DIFY_API_KEY. Please set it in your app config.');
    }

    const rawBaseUrl = 'http://ai.haokui.top/v1';
    const endpoint = `${rawBaseUrl.replace(/\/$/, '')}/chat-messages`;

    const { conversationId, personInfo, friendsInfo,messageList,currentMessage  } = get();
    const payload: Record<string, any> = {
      query: trimmedContent,
      response_mode: 'streaming',
      inputs: {},
      user: String('reply_user_'+ friendsInfo.user_id),
      //conversation_id: String('reply_user_'+ friendsInfo.user_id +'_'+ friendsInfo.id),
    };

    const es = new EventSource(
      endpoint,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${difyApiKey}`,
        },
        method: "POST",
        // Remember to read the OpenAI API documentation to set the correct body
        body: JSON.stringify(payload),
      }
    );

    es.addEventListener("open", () => {
      console.log('es open')
    });

    es.addEventListener("message", (event) => {
        console.log(event.data)
        var data = event.data;
        var json = JSON.parse(data as string)
        //console.log(json)
        if(json.event=='message_end') {
          set((state) => ({
            messageList: [
              ...state.messageList,
              {
                from: 'ai',
                content: state.currentMessage
              }
            ],
            currentMessage: ''
          }))
          es.removeAllEventListeners();
          es.close();
        }
        if(json.event=='message') {
          set((state) => ({
            currentMessage: state.currentMessage + json.answer
          }))
        }
        if(json.event=='workflow_started') {
          set((state) => ({
            messageList: [
              ...state.messageList,
              {
                from: 'user',
                content: trimmedContent
              }
            ],
            currentMessage: ''
          }))
        }
        /**
         * {"answer": "?", "conversation_id": "a699bd38-ded7-4f3c-b1eb-d7157b61a84d", "created_at": 1763201574, "event": "message", "from_variable_selector": ["llm", "text"], "id": "5a654f07-b076-49e6-9012-cccb7fbf91c2", "message_id": "5a654f07-b076-49e6-9012-cccb7fbf91c2", "task_id": "7918c1d5-e788-4012-b995-b9c4f20fa884"}

         */

        /**
         * {"data": "{\"event\":\"message_end\",\"conversation_id\":\"2a0d9a25-36aa-4965-a8e7-4289bb0914c0\",\"message_id\":\"f2c8456a-4712-4d6d-a7e4-a452306bc14c\",\"created_at\":1763201389,\"task_id\":\"a6486c0f-a3b4-49cc-9aa5-5bd4592220bc\",\"id\":\"f2c8456a-4712-4d6d-a7e4-a452306bc14c\",\"metadata\":{\"annotation_reply\":null,\"retriever_resources\":[],\"usage\":{\"prompt_tokens\":17,\"prompt_unit_price\":\"0.0005\",\"prompt_price_unit\":\"0.001\",\"prompt_price\":\"0.0000085\",\"completion_tokens\":31,\"completion_unit_price\":\"0.0005\",\"completion_price_unit\":\"0.001\",\"completion_price\":\"0.0000155\",\"total_tokens\":48,\"total_price\":\"0.000024\",\"currency\":\"RMB\",\"latency\":1.339,\"time_to_first_token\":1.413,\"time_to_generate\":0.603}},\"files\":[]}", "lastEventId": null, "type": "message", "url": "http://ai.haokui.top/v1/chat-messages"}
         */

   //   if (event.data !== "[DONE]") {
        //console.log(event)
     // }
    });

  }
}));


