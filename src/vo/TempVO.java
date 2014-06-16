package vo;

import java.io.Serializable;
import java.sql.Date;

public class TempVO	implements Serializable 
{
	private static final long serialVersionUID = 1L;
	
	private Date	date;
	private	String	editor;
	private String	contentsId;
	
	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}
	public String getEditor() {
		return editor;
	}
	public void setEditor(String editor) {
		this.editor = editor;
	}
	public String getContentsId() {
		return contentsId;
	}
	public void setContentsId(String contentsId) {
		this.contentsId = contentsId;
	}
	
	@Override
	public String toString() {
		return "TempVO [date=" + date + ", editor=" + editor + ", contentsId="
				+ contentsId + "]";
	}
}
