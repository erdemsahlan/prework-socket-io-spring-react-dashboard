package com.preworkspringsocketio.model;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Message  extends BaseModel{
    private String messageType;
    private String content;
    private String room;
    private String username;
}
