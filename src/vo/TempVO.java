package vo;

import java.io.Serializable;
import java.util.Calendar;

import vo.ContentsVO;

public class TempVO	implements Serializable 
{
	private static final long serialVersionUID = 1L;
	
	private Calendar	date;
	private	String		editor;
	private ContentsVO	contents;
	
	public Calendar getDate() {
		return date;
	}
	public void setDate(Calendar date) {
		this.date = date;
	}
	public String getEditor() {
		return editor;
	}
	public void setEditor(String editor) {
		this.editor = editor;
	}
	public ContentsVO getContents() {
		return contents;
	}
	public void setContents(ContentsVO contents) {
		this.contents = contents;
	}
	
	@Override
	public String toString() {
		return "TempInfoVO [date=" + date + ", editor=" + editor
				+ ", contents=" + contents + "]";
	}
}
