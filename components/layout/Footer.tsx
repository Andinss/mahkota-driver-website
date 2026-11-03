import type { ContactData } from "@/types/content";

export default function Footer({ contact }: { contact: ContactData }) {
  return (
    <footer>
      <div className="w fo">
        <div>
          <b>Mahkota Drive</b>
          <p>{contact.address}</p>
          <p>{contact.phone}</p>
        </div>
        <div>
          <a href={contact.socialMedia.instagram}>Instagram</a>
          <a href={contact.socialMedia.facebook}>Facebook</a>
        </div>
      </div>
    </footer>
  );
}
