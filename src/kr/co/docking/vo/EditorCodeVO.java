package kr.co.docking.vo;

import java.io.Serializable;

public class EditorCodeVO	implements Serializable 
{
	private static final long serialVersionUID = 1L;
	
	private String	editorId;
	private String	code;
	private String	path;
	
	public String getEditorId() {
		return editorId;
	}
	public void setEditorId(String editorId) {
		this.editorId = editorId;
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
		result = prime * result + ((path == null) ? 0 : path.hashCode());
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
		EditorCodeVO other = (EditorCodeVO) obj;
		if (path == null) {
			if (other.path != null)
				return false;
		} else if (!path.equals(other.path))
			return false;
		return true;
	}
	@Override
	public String toString() {
		return "EditorCodeVO [editorId=" + editorId + ", code=" + code
				+ ", path=" + path + "]";
	}
}
