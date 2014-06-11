package vo;

import java.io.Serializable;

public class ContentsVO	implements Serializable 
{
	private static final long serialVersionUID = 1L;
	
	private	String	contetsId;
	private String	title;
	private String	body;
	private String	type;
	private String	path;
	
	public String getPath() {
		return path;
	}
	public void setPath(String path) {
		this.path = path;
	}
	public String getContetsId() {
		return contetsId;
	}
	public void setContetsId(String contetsId) {
		this.contetsId = contetsId;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getBody() {
		return body;
	}
	public void setBody(String body) {
		this.body = body;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result
				+ ((contetsId == null) ? 0 : contetsId.hashCode());
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
		ContentsVO other = (ContentsVO) obj;
		if (contetsId == null) {
			if (other.contetsId != null)
				return false;
		} else if (!contetsId.equals(other.contetsId))
			return false;
		return true;
	}
	@Override
	public String toString() {
		return "ContentsVO [contetsId=" + contetsId + ", title=" + title
				+ ", body=" + body + ", type=" + type + ", path=" + path + "]";
	}
}
