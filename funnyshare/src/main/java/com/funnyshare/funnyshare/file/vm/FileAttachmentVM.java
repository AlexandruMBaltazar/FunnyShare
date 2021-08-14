package com.funnyshare.funnyshare.file.vm;

import com.funnyshare.funnyshare.file.FileAttachment;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class FileAttachmentVM {

    private String name;

    private String fileType;

    public FileAttachmentVM(FileAttachment fileAttachment) {
        setName(fileAttachment.getName());
        setFileType(fileAttachment.getFileType());
    }
}
