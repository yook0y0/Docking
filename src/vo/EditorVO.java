package vo;

import java.io.Serializable;

public class EditorVO	implements Serializable
{
	private static final long serialVersionUID = 3459403639778800584L;
	
	private String	director;
	private	String	name;
	private String	info;
	private String	startPage;
	private String	getMethod;
	private String	setMethod;
	private	Integer	editorType;
	
	public String getDirector() {
		return director;
	}
	public void setDirector(String director) {
		this.director = director;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getInfo() {
		return info;
	}
	public void setInfo(String info) {
		this.info = info;
	}
	public String getStartPage() {
		return startPage;
	}
	public void setStartPage(String startPage) {
		this.startPage = startPage;
	}
	public String getGetMethod() {
		return getMethod;
	}
	public void setGetMethod(String getMethod) {
		this.getMethod = getMethod;
	}
	public String getSetMethod() {
		return setMethod;
	}
	public void setSetMethod(String setMethod) {
		this.setMethod = setMethod;
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
				+ ((director == null) ? 0 : director.hashCode());
		result = prime * result
				+ ((getMethod == null) ? 0 : getMethod.hashCode());
		result = prime * result + ((info == null) ? 0 : info.hashCode());
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result
				+ ((setMethod == null) ? 0 : setMethod.hashCode());
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
		if (director == null) {
			if (other.director != null)
				return false;
		} else if (!director.equals(other.director))
			return false;
		if (getMethod == null) {
			if (other.getMethod != null)
				return false;
		} else if (!getMethod.equals(other.getMethod))
			return false;
		if (info == null) {
			if (other.info != null)
				return false;
		} else if (!info.equals(other.info))
			return false;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
		if (setMethod == null) {
			if (other.setMethod != null)
				return false;
		} else if (!setMethod.equals(other.setMethod))
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
		return "EditorVO [director=" + director + ", name=" + name + ", info="
				+ info + ", startPage=" + startPage + ", getMethod="
				+ getMethod + ", setMethod=" + setMethod + ", editorType="
				+ editorType + "]";
	}
}
