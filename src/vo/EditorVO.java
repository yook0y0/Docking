package vo;

import java.io.Serializable;

public class EditorVO	implements Serializable
{
	private static final long serialVersionUID = 1L;
	
	private String	id;
	private	String	editorName;
	private String	startPage;
	private String	code;
	private String	path;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getEditorName() {
		return editorName;
	}
	public void setEditorName(String editorName) {
		this.editorName = editorName;
	}
	public String getStartPage() {
		return this.startPage;
	}
	public void setStartPage(String startPage){
		this.startPage = startPage;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getPath() {
		return path;
	}
	public void setPath(String path) {
		this.path = path;
	}
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((code == null) ? 0 : code.hashCode());
		result = prime * result
				+ ((editorName == null) ? 0 : editorName.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((path == null) ? 0 : path.hashCode());
		result = prime * result
				+ ((startPage == null) ? 0 : startPage.hashCode());
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
		EditorVO other = (EditorVO) obj;
		if (code == null) {
			if (other.code != null)
				return false;
		} else if (!code.equals(other.code))
			return false;
		if (editorName == null) {
			if (other.editorName != null)
				return false;
		} else if (!editorName.equals(other.editorName))
			return false;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (path == null) {
			if (other.path != null)
				return false;
		} else if (!path.equals(other.path))
			return false;
		if (startPage == null) {
			if (other.startPage != null)
				return false;
		} else if (!startPage.equals(other.startPage))
			return false;
		return true;
	}
	@Override
	public String toString() {
		return "EditorVO [id=" + id + ", editorName=" + editorName
				+ ", startPage=" + startPage + ", code=" + code + ", path="
				+ path + "]";
	}
}
