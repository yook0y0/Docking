package analysis.filter;

import analysis.DockingAnalyzer;
import analysis.attribute.Attr;
import analysis.attribute.DataAttribute;

public class FileExtensionFilter extends Filter {

	public FileExtensionFilter(DockingAnalyzer stream) {
		super(stream);
		// TODO Auto-generated constructor stub
	}

	@Override
	public void analyze() throws Exception {
		// TODO Auto-generated method stub
		
		DataAttribute dAttr = null;

		dAttr = (DataAttribute)this.addAttribute(Attr.ATTRSET_FILE_DATA, DataAttribute.class);

		if(dAttr != null){

			dAttr = (DataAttribute)this.getStream().getAttrSet().get(Attr.ATTRSET_FILE_DATA);
			
			byte[][] type = dAttr.getType();
			byte[][] data = dAttr.getData();
			
			int size = type.length;
			String[] typeTmp = new String[size];
			String[] dataTmp = new String[size];
			
			for(int i=0;i<size;i++){
				typeTmp[i] = new String(type[i]);
			}
			
			int len = 0;
			for(int i=0;i<size;i++){
				len = typeTmp[i].lastIndexOf(".");
				
				if(len > 0){
					dataTmp[i] = typeTmp[i].substring(len+1,typeTmp[i].length());
				}
				else{
					dataTmp[i] = "dir";
				}
			}
			
			for(int i=0;i<size;i++){
				data[i] = typeTmp[i].getBytes();
				type[i] = dataTmp[i].getBytes();
			}
			
			dAttr.setType(type);
			dAttr.setData(data);
			this.getAttrSet().put(Attr.ATTRSET_FILE_DATA, dAttr);
		}
		else{
			// Error Message..
		}
	}
}
