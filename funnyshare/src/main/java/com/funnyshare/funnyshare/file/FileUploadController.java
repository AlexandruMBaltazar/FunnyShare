package com.funnyshare.funnyshare.file;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.UUID;

@RestController
@RequestMapping("/api/1.0")
public class FileUploadController {

    @PostMapping("posts/upload")
    public FileAttachment uploadForPost() {
        FileAttachment fileAttachment = new FileAttachment();
        fileAttachment.setDate(new Date());

        String randomName = UUID.randomUUID().toString().replaceAll("-", "");
        fileAttachment.setName(randomName);

        return  fileAttachment;
    }

}