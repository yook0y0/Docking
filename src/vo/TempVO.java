package vo;

import java.io.Serializable;

public class TempVO	implements Serializable 
{
	private static final long serialVersionUID = 1L;
	
	private String	buDate;
	private	String	backUpData;
	private String	docId;
	private	Integer	checkLast;
	
	
	public String getBuDate() {
		return buDate;
	}
	public void setBuDate(String buDate) {
		this.buDate = buDate;
	}
	public String getDocId() {
		return docId;
	}
	public void setDocId(String docId) {
		this.docId = docId;
	}
	public String getBackUpData() {
		return backUpData;
	}
	public void setBackUpData(String backUpData) {
		this.backUpData = backUpData;
	}
	public Integer getCheckLast() {
		return checkLast;
	}
	public void setCheckLast(Integer checkLast) {
		this.checkLast = checkLast;
	}
	
	@Override
	public String toString() {
		return "TempVO [buDate=" + buDate + ", backUpData=" + backUpData
				+ ", docId=" + docId + ", checkLast=" + checkLast + "]";
	}
}
