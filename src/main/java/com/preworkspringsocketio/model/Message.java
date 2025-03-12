package com.preworkspringsocketio.model;

import lombok.Data;

public class Message {
    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    private String content;
}
