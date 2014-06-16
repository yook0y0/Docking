package analysis.filter;

import analysis.DockingAnalyzer;
import analysis.attribute.Attr;
import analysis.attribute.DataAttribute;

public class StringReplaceFilter extends Filter {
	
	private String srcStr;
	private String destStr;
	private int changeType;
	
	public static int CHANGE_TYPE = 0;
	public static int CHANGE_DATA = 1;
	public static int CHANGE_ALL = 2;

	public StringReplaceFilter(DockingAnalyzer stream, String srcStr, String destStr) {
		this(stream,srcStr,destStr,CHANGE_DATA);
		// TODO Auto-generated constructor stub
	}
	
	public StringReplaceFilter(DockingAnalyzer stream, String srcStr, String destStr, int changeType) {
		super(stream);
		this.srcStr = srcStr;
		this.destStr = destStr;
		this.changeType = changeType;
	}

	public String getSrcStr() {
		return srcStr;
	}

	public void setSrcStr(String srcStr) {
		this.srcStr = srcStr;
	}

	public String getDestStr() {
		return destStr;
	}

	public void setDestStr(String destStr) {
		this.destStr = destStr;
	}
	
	public int getChangeType() {
		return changeType;
	}

	public void setChangeType(int changeType) {
		this.changeType = changeType;
	}

	@Override
	public void analyze() throws Exception {
		// TODO Auto-generated method stub

		DataAttribute dAttr = null;

		dAttr = (DataAttribute)this.addAttribute(Attr.ATTRSET_FILE_DATA, DataAttribute.class);

		if(dAttr != null){

			dAttr = (DataAttribute)this.getStream().getAttrSet().get(Attr.ATTRSET_FILE_DATA);

			byte[][] data = dAttr.getData();
			byte[][] type = dAttr.getType();
			
			int size = data.length;
			
			for(int i=0;i<size;i++){
			
				if(this.changeType == StringReplaceFilter.CHANGE_DATA || this.changeType == StringReplaceFilter.CHANGE_ALL){
					data[i] = this.replace(data[i]);
				}
				if(this.changeType == StringReplaceFilter.CHANGE_TYPE || this.changeType == StringReplaceFilter.CHANGE_ALL){
					type[i] = this.replace(type[i]);
				}
			}
			
			dAttr.setProcess(Attr.PROCESS_FILTER);
			
			this.getAttrSet().put(Attr.ATTRSET_FILE_DATA, dAttr);
		}
		else{
			// Error Message..
		}
	}

	private byte[] replace(byte[] data){
		
		String sData = new String(data);
		
		sData = sData.replace(this.srcStr, this.destStr);
		
		return sData.getBytes();
	}
}
