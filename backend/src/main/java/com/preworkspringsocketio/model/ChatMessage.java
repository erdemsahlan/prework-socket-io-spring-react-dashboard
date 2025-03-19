package com.preworkspringsocketio.model;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessage {
    private String sender;
    private String content;
    private Date timestamp;
    private MessageType type;
}
