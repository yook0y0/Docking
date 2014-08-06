package org.docking.erbse.service;

import org.docking.erbse.dao.service.GenericService;
import org.docking.erbse.dao.serviceImpl.GenericServiceImpl;
import org.docking.erbse.email.EmailSendable;
import org.docking.erbse.email.EmailSender;
import org.docking.erbse.util.GlobalVariable;
import org.docking.erbse.util.JsonParser;
import org.docking.erbse.vo.MemberVO;

public class MemberServiceImpl implements MemberService {

	@Override
	public Integer memberAdd(MemberVO member) 
	{
		String memberId = member.getMemberId();
		String pw = member.getPw();
		String memberName = member.getMemberName();
		String type = String.valueOf(member.getType());
		
		String address = GlobalVariable.SERVER_ADDRESS + "/memberAddChk";
		
		String str = "승인을 누르면 가입됩니다.<br>";
		String msg = "<html><head><title></title></head><body>"+ str +"<form name='form' method='post' action='"+ address +"'><input type='hidden' name='memberId' value='"+ memberId +"'><input type='hidden' name='pw' value='"+ pw +"'><input type='hidden' name='memberName' value='"+ memberName +"'><input type='hidden' name='type' value='"+ type +"'><input type='submit' value='승인'/></form></body></html>";
		
		EmailSendable emailSender = new EmailSender();
		emailSender.setTo(memberId);
		emailSender.setFrom("Docking");
		emailSender.setSubject("Docking 가입 승인 메일입니다.");
		emailSender.setContent(msg);
		emailSender.setContentType("text/html; charset=EUC-KR");
		emailSender.sendEmail();
		
		return 1;
	}

	@Override
	public Integer memberModify(MemberVO member) 
	{
		GenericService<MemberVO>	memService = new GenericServiceImpl<MemberVO>();
		Integer res = memService.modify("member_modify", member);
		
		return res;
	}

   @Override
   public MemberVO memberSearch(String memberId) 
   {
      GenericService<MemberVO>   memService = new GenericServiceImpl<MemberVO>();

      return memService.search("member_search", memberId);
   }
   
   public String memberSearch(MemberVO member)
   {
      String[] objName = new String[]{"memberVO"};

      String jMvo = JsonParser.getInstance().jParseObj(GlobalVariable.MEM_VO_FIELD, new String[]{member.getMemberId(),member.getPw(),member.getMemberName(),String.valueOf(member.getType())});

      return JsonParser.getInstance().jParseObj(objName,new String[]{jMvo});
   }

   @Override
   public Integer memberDelete(String memberId) 
   {
      GenericService<MemberVO>   genericService = new GenericServiceImpl<MemberVO>();
      Integer res = genericService.delete("member_delete", memberId);
      
      return res;
   }
   
   @Override
   public Integer memberAddChk(MemberVO member) 
   {
      GenericService<MemberVO>   memService = new GenericServiceImpl<MemberVO>();
      Integer res = memService.add("member_add", member);
      
      return res;
   }
   
   @Override
   public Integer memberLogin(String memberId, String pw)
   {
      GenericService<MemberVO>   genericService = new GenericServiceImpl<MemberVO>();
      MemberVO   memberVO = genericService.search("member_search", memberId);
      
      if(memberVO == null)
      {
         return -1;
      }
      
      else if(!memberVO.getPw().equals(pw))
      {
         return 0;
      }
      
      return 1;
   }
}
