package org.docking.erbse.vo;

import java.io.Serializable;

public class ContentVO	implements Serializable
{
	private static final long serialVersionUID = 1L;
	
	private String	documentId;
	private String	contentId;
	private	String	body;
	private	String	editorId;
	
	public String getDocumentId() {
		return documentId;
	}
	public void setDocumentId(String documentId) {
		this.documentId = documentId;
	}
	public String getContentId() {
		return contentId;
	}
	public void setContentId(String contentId) {
		this.contentId = contentId;
	}
	public String getBody() {
		return body;
	}
	public void setBody(String body) {
		this.body = body;
	}
	public String getEditorId() {
		return editorId;
	}
	public void setEditorId(String editorId) {
		this.editorId = editorId;
	}
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result
				+ ((contentId == null) ? 0 : contentId.hashCode());
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
		ContentVO other = (ContentVO) obj;
		if (contentId == null) {
			if (other.contentId != null)
				return false;
		} else if (!contentId.equals(other.contentId))
			return false;
		return true;
	}
	@Override
	public String toString() {
		return "ContentVO [documentId=" + documentId + ", contentId="
				+ contentId + ", body=" + body + ", editorId=" + editorId + "]";
	}
}
