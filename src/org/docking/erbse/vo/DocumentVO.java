package org.docking.erbse.vo;

import java.io.Serializable;

public class DocumentVO	implements Serializable
{
	private static final long serialVersionUID = 1L;
	
	private String	documentId;
	private String	writer;
	private	String	title;
	private	String	creationDate;
	
	public String getDocumentId() {
		return documentId;
	}
	public void setDocumentId(String documentId) {
		this.documentId = documentId;
	}
	public String getWriter() {
		return writer;
	}
	public void setWriter(String writer) {
		this.writer = writer;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getCreationDate() {
		return creationDate;
	}
	public void setCreationDate(String creationDate) {
		this.creationDate = creationDate;
	}
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result
				+ ((documentId == null) ? 0 : documentId.hashCode());
		return result;
	}
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		DocumentVO other = (DocumentVO) obj;
		if (documentId == null) {
			if (other.documentId != null)
				return false;
		} else if (!documentId.equals(other.documentId))
			return false;
		return true;
	}
	@Override
	public String toString() {
		return "DocumentVO [documentId=" + documentId + ", writer=" + writer
				+ ", title=" + title + ", creationDate=" + creationDate + "]";
	}
}
