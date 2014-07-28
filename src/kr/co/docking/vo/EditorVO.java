package kr.co.docking.vo;

import java.io.Serializable;

public class EditorVO	implements Serializable
{
	private static final long serialVersionUID = 1L;
	
	private String	editorId;
	private	String	director;
	private	String	description;
	private	Integer	editorType;
	
	public String getEditorId() {
		return editorId;
	}
	public void setEditorId(String editorId) {
		this.editorId = editorId;
	}
	public String getDirector() {
		return director;
	}
	public void setDirector(String director) {
		this.director = director;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Integer getEditorType() {
		return editorType;
	}
	public void setEditorType(Integer editorType) {
		this.editorType = editorType;
	}
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result
				+ ((editorId == null) ? 0 : editorId.hashCode());
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
		if (editorId == null) {
			if (other.editorId != null)
				return false;
		} else if (!editorId.equals(other.editorId))
			return false;
		return true;
	}
	@Override
	public String toString() {
		return "EditorVO [editorId=" + editorId + ", director=" + director
				+ ", description=" + description + ", editorType=" + editorType
				+ "]";
	}
}
