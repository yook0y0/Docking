package vo;

import java.io.Serializable;
import java.sql.Date;

public class DockingEnvironmentVO	implements Serializable 
{
	private static final long serialVersionUID = 1L;

	private	String		docId;
	private String 		title;
	private String		creationDate;
	private	String		writer;
	
	public String getDocId() {
		return docId;
	}
	public void setDocId(String docId) {
		this.docId = docId;
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
	public String getWriter() {
		return writer;
	}
	public void setWriter(String writer) {
		this.writer = writer;
	}
	
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((docId == null) ? 0 : docId.hashCode());
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
		DockingEnvironmentVO other = (DockingEnvironmentVO) obj;
		if (docId == null) {
			if (other.docId != null)
				return false;
		} else if (!docId.equals(other.docId))
			return false;
		return true;
	}
	
	@Override
	public String toString() {
		return "CollaborativeEnvironmentVO [docId=" + docId + ", title="
				+ title + ", creationDate=" + creationDate + ", writer="
				+ writer + "]";
	}
}
