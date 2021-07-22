package com.funnyshare.funnyshare.post;

import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
public class Post {

    @Id
    @GeneratedValue
    private long id;

    private String content;

    @Temporal(TemporalType.TIMESTAMP)
    private Date timestamp;
}
